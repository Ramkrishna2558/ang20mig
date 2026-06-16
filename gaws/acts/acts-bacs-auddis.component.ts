/**
 * GAWS-7103: Acts BACS-AUDDIS Migration
 * Component: Angular 20 Standalone
 *
 * Standards enforced:
 * - inject() only — zero constructor DI
 * - Signals for all state (signal, computed, input, output)
 * - ChangeDetectionStrategy.OnPush
 * - takeUntilDestroyed via DestroyRef
 * - async pipe in template for observables
 * - No console.log
 * - No magic values — all from model constants
 * - Single-purpose: logic delegated to service
 * - WCAG: aria-labels on interactive elements
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { ActsBacsAuddisService } from '../service/acts-bacs-auddis.service';
import { PaginationTotal } from '@shared/components/pagination-total/pagination-total';
import { I18nextService } from '@services/i18next-service';
import {
  ActsBacsAuddisDocument,
  ActsBacsAuddisJob,
  ActsBacsAuddisJobType,
  ACTS_BACS_AUDDIS_JOB_TYPE,
  ACTS_DUNNING_JOB_TYPE,
  ENTITY_ACTS_BACS_AUDDIS,
  ENTITY_ACTS_BACS_AUDDIS_OVERVIEW,
} from '../model/acts-bacs-auddis.model';

@Component({
  selector: 'app-acts-bacs-auddis',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NzTableModule,
    NzIconModule,
    NzTagModule,
    NzButtonModule,
    NzSpinModule,
    NzEmptyModule,
    PaginationTotal,
  ],
  templateUrl: './acts-bacs-auddis.component.html',
  styleUrl: './acts-bacs-auddis.component.scss',
})
export class ActsBacsAuddisComponent implements OnInit {
  // ─── Dependency Injection ────────────────────────────────────────────────
  private readonly service = inject(ActsBacsAuddisService);
  private readonly i18nextService = inject(I18nextService);
  private readonly destroyRef = inject(DestroyRef);

  // ─── Inputs (Signal-based — Angular 20) ──────────────────────────────────
  readonly showActsDunning = input<boolean>(false);
  readonly headerTranslationKey = input<string>('onePay.actsBacsAuddisJobProtocol');

  // ─── Internal State ───────────────────────────────────────────────────────
  readonly jobs = signal<ActsBacsAuddisJob[]>([]);
  readonly totalElements = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly isLoadMoreDisabled = signal<boolean>(false);

  // ─── Exposed service signals (forwarded for template) ────────────────────
  readonly isLoading = this.service.isLoading;
  readonly hasError = this.service.hasError;

  // ─── Computed values ──────────────────────────────────────────────────────
  readonly resolvedJobType = computed<ActsBacsAuddisJobType>(() =>
    this.showActsDunning() ? ACTS_DUNNING_JOB_TYPE : ACTS_BACS_AUDDIS_JOB_TYPE
  );

  readonly resolvedHeaderKey = computed<string>(() =>
    this.headerTranslationKey() ?? 'onePay.actsBacsAuddisJobProtocol'
  );

  readonly translations = computed(() =>
    this.i18nextService.getTranslations()
  );

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadPage(1);
  }

  // ─── Public Methods ───────────────────────────────────────────────────────
  onLoadMore(): void {
    const nextPage = this.currentPage() + 1;
    this.isLoadMoreDisabled.set(true);
    this.loadPage(nextPage);
  }

  trackById(_index: number, job: ActsBacsAuddisJob): number {
    return job.id;
  }

  trackByEntityId(_index: number, doc: ActsBacsAuddisDocument): string {
    return doc.entityId;
  }

  getJobStatusLabel(isSuccessful: boolean): string {
    return this.service.getJobStatus(isSuccessful);
  }

  getJobStatusColor(isSuccessful: boolean): string {
    return isSuccessful ? 'success' : 'error';
  }

  getDocumentDownloadUrl(doc: ActsBacsAuddisDocument): string {
    return this.service.buildDownloadUrl(doc, ENTITY_ACTS_BACS_AUDDIS);
  }

  getOverviewDownloadUrl(doc: ActsBacsAuddisDocument): string {
    return this.service.buildDownloadUrl(doc, ENTITY_ACTS_BACS_AUDDIS_OVERVIEW);
  }

  isOverviewDocument(doc: ActsBacsAuddisDocument): boolean {
    return this.service.isOverviewDocument(doc.filePath);
  }

  // ─── Private Methods ──────────────────────────────────────────────────────
  private loadPage(pageNumber: number): void {
    this.service
      .getJobsProtocol(this.resolvedJobType(), pageNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        const page = response?.data?.ActsBacsAuddis;
        if (!page?.result?.length) {
          this.isLoadMoreDisabled.set(false);
          return;
        }

        const accumulated = this.service.accumulateResults(
          this.jobs(),
          page.result,
          page.currentPage
        );

        this.jobs.set(accumulated);
        this.currentPage.set(page.currentPage);
        this.totalElements.set(page.totalElements);
        this.isLoadMoreDisabled.set(false);
      });
  }
}
