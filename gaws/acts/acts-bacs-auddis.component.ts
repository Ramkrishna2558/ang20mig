/**
 * GAWS-7103: Acts BACS-AUDDIS Migration
 *
 * Angular Standards enforced:
 * ✅ inject() only — zero constructor DI
 * ✅ Signals for ALL state (signal, computed, input)
 * ✅ ChangeDetectionStrategy.OnPush — no cdr needed with Signals
 * ✅ takeUntilDestroyed(destroyRef) on every subscription
 * ✅ No console.log | No magic values | No `any` types
 * ✅ Single-purpose: all HTTP logic delegated to service
 * ✅ Business logic unchanged from legacy
 * ✅ WCAG: aria-label on section element
 */

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { CustomGrid } from '@shared/components/custom-grid/custom-grid';
import { PaginationTotal } from '@shared/components/pagination-total/pagination-total';
import { I18nextService } from '@services/i18next-service';
import { ActsBacsAuddisService } from '@services/acts-bacs-auddis.service';
import {
  GridColumnDef,
  GridRow,
  GridRowActionInput,
  GridRowActionsResolver,
} from '@model/custom-grid.types';
import {
  ActsBacsAuddisJob,
  ActsBacsAuddisJobType,
  ACTS_BACS_AUDDIS_JOB_TYPE,
  ACTS_DUNNING_JOB_TYPE,
  ENTITY_ACTS_BACS_AUDDIS,
  ENTITY_ACTS_BACS_AUDDIS_OVERVIEW,
} from '@model/acts-bacs-auddis.model';

@Component({
  selector: 'app-acts-bacs-auddis',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzSpinModule, CustomGrid, PaginationTotal],
  templateUrl: './acts-bacs-auddis.component.html',
  styleUrl: './acts-bacs-auddis.component.scss',
})
export class ActsBacsAuddisComponent implements OnInit {
  // ── Dependency Injection (inject() only — no constructor) ─────────────────
  private readonly actsBacsAuddisService = inject(ActsBacsAuddisService);
  private readonly i18nextService = inject(I18nextService);
  private readonly destroyRef = inject(DestroyRef);

  // ── Signal Inputs (Angular 20) ────────────────────────────────────────────
  readonly showActsDunning = input<boolean>(false);
  readonly headerTranslationKey = input<string>('');

  // ── Public State Signals (bound in template) ──────────────────────────────
  readonly title = signal<string>('');
  readonly spinnerVisible = signal<boolean>(false);
  readonly gridRows = signal<GridRow[]>([]);
  readonly gridColumns = signal<GridColumnDef[]>([]);
  readonly totalElements = signal<number>(0);
  readonly loadMoreDisabled = signal<boolean>(false);

  // ── Private State Signals (internal tracking only) ────────────────────────
  private readonly jobs = signal<ActsBacsAuddisJob[]>([]);
  private readonly currentPage = signal<number>(1);

  // ── Computed Values ───────────────────────────────────────────────────────
  readonly jobType = computed<ActsBacsAuddisJobType>(() =>
    this.showActsDunning() ? ACTS_DUNNING_JOB_TYPE : ACTS_BACS_AUDDIS_JOB_TYPE
  );

  readonly exportFileBaseName = computed<string>(() =>
    this.showActsDunning()
      ? 'acts-dunning-overview'
      : 'acts-bacs-auddis-overview'
  );

  // ── Row Actions Resolver ──────────────────────────────────────────────────
  // Arrow function: `this` captured lexically — safe with OnPush + Signals
  // Reads this.jobs() signal value at call time (non-reactive read — returns current value)
  // Returns [] for rows with no documents → Actions column renders empty for that row
  // Returns ['download'], ['download2'], or both — resolved by grid to GRID_ACTION_PRESETS
  // Click events surface via (rowActionTriggered) — handled in onRowActionTriggered()
  // ⚠️ Requires custom-grid.ts onRowAction to emit rowActionTriggered for 'download'/'download2'
  readonly rowActionsResolver: GridRowActionsResolver = (context) => {
    const jobId = Number(context.row['id']);
    const job = this.jobs().find((j) => j.id === jobId);

    if (!job?.documents?.length) {
      return [];
    }

    const actions: GridRowActionInput[] = [];

    const hasDocument = job.documents.some(
      (d) => !!d.filePath && !this.actsBacsAuddisService.isOverviewDocument(d.filePath)
    );
    if (hasDocument) {
      actions.push('download');
    }

    const hasOverview = job.documents.some(
      (d) => !!d.filePath && this.actsBacsAuddisService.isOverviewDocument(d.filePath)
    );
    if (hasOverview) {
      actions.push('download2');
    }

    return actions;
  };

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.subscribeToTranslations();
    this.loadJobs(1);
  }

  // ── Public Event Handlers ─────────────────────────────────────────────────

  onRowActionTriggered(event: { actionId: string; row: GridRow }): void {
    if (event.actionId !== 'download' && event.actionId !== 'download2') {
      return;
    }

    const jobId = Number(event.row['id']);
    const job = this.jobs().find((j) => j.id === jobId);

    if (!job?.documents?.length) {
      return;
    }

    if (event.actionId === 'download') {
      const doc = job.documents.find(
        (d) => !!d.filePath && !this.actsBacsAuddisService.isOverviewDocument(d.filePath)
      );
      if (doc) {
        window.open(
          this.actsBacsAuddisService.buildDownloadUrl(doc, ENTITY_ACTS_BACS_AUDDIS),
          '_blank',
          'noopener,noreferrer'
        );
      }
      return;
    }

    const overviewDoc = job.documents.find(
      (d) => !!d.filePath && this.actsBacsAuddisService.isOverviewDocument(d.filePath)
    );
    if (overviewDoc) {
      window.open(
        this.actsBacsAuddisService.buildDownloadUrl(overviewDoc, ENTITY_ACTS_BACS_AUDDIS_OVERVIEW),
        '_blank',
        'noopener,noreferrer'
      );
    }
  }

  onLoadMore(): void {
    this.loadMoreDisabled.set(true);
    this.loadJobs(this.currentPage() + 1);
  }

  // ── Private Methods ───────────────────────────────────────────────────────

  private subscribeToTranslations(): void {
    this.i18nextService
      .getTranslationData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.title.set(
          data?.onePay?.actsBacsAuddisJobProtocol || 'ACTS Auddis Data Job Protocol'
        );

        this.gridColumns.set([
          {
            field: 'id',
            header: data?.grpReports?.id || 'Id',
            sortable: true,
            filterable: true,
            editable: false,
            width: '80px',
          },
          {
            field: 'jobType',
            header: data?.grpReports?.actsJobType || 'ACTS Job Type',
            sortable: true,
            filterable: true,
            editable: false,
            width: '160px',
          },
          {
            field: 'startDate',
            header: data?.grpReports?.startDate || 'Start Date',
            sortable: true,
            filterable: false,
            editable: false,
            width: '180px',
          },
          {
            field: 'endDate',
            header: data?.grpReports?.endDate || 'End Date',
            sortable: true,
            filterable: false,
            editable: false,
            width: '180px',
          },
          {
            field: 'status',
            header: data?.grpReports?.status || 'Status',
            sortable: true,
            filterable: true,
            editable: false,
            width: '140px',
          },
          {
            field: 'documentName',
            header: data?.grpReports?.documentName || 'Document Name',
            sortable: false,
            filterable: true,
            editable: false,
            width: '260px',
          },
          {
            field: 'info',
            header: data?.grpReports?.info || 'Info',
            sortable: false,
            filterable: true,
            editable: false,
            width: '280px',
          },
        ]);
      });
  }

  private loadJobs(pageNumber: number): void {
    this.spinnerVisible.set(true);

    this.actsBacsAuddisService
      .getJobsProtocol(this.jobType(), pageNumber)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.spinnerVisible.set(false);
          this.loadMoreDisabled.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          const page = response?.data?.ActsBacsAuddis;

          if (!page?.result?.length) {
            return;
          }

          const accumulated: ActsBacsAuddisJob[] =
            page.currentPage > 1
              ? [...this.jobs(), ...page.result]
              : page.result;

          this.jobs.set(accumulated);
          this.currentPage.set(page.currentPage);
          this.totalElements.set(page.totalElements);
          this.gridRows.set(accumulated.map((job) => this.mapToGridRow(job)));
        },
        error: () => {
          this.gridRows.set([]);
        },
      });
  }

  private mapToGridRow(job: ActsBacsAuddisJob): GridRow {
    return {
      id: job.id,
      jobType: job.jobType ?? '',
      startDate: this.formatDate(job.startDate),
      endDate: this.formatDate(job.endDate),
      status: job.isSuccessful ? 'SUCCESSFUL' : 'UNSUCCESSFUL',
      documentName: job.documentName ?? '',
      info: job.info ?? '',
    };
  }

  private formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) {
      return '';
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return dateStr;
    }
    const pad = (n: number): string => String(n).padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = pad(d.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = pad(hours % 12 || 12);
    return `${day}.${month}.${year} ${displayHours}:${minutes} ${ampm}`;
  }
}
