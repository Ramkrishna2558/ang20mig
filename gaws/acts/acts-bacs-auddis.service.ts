/**
 * GAWS-7103: Acts BACS-AUDDIS Migration
 * Service: HTTP calls routed through dedicated service (Angular Standards).
 * - Uses inject() — no constructor DI
 * - Uses Signals for state
 * - shareReplay to avoid duplicate API calls
 * - All HTTP through this service, never in component
 */

import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, EMPTY, finalize, shareReplay } from 'rxjs';
import {
  ActsBacsAuddisApiResponse,
  ActsBacsAuddisJob,
  ActsBacsAuddisJobType,
  ACTS_BACS_AUDDIS_PAGE_SIZE,
} from '../model/acts-bacs-auddis.model';

@Injectable({ providedIn: 'root' })
export class ActsBacsAuddisService {
  private readonly http = inject(HttpClient);

  readonly isLoading = signal<boolean>(false);
  readonly hasError = signal<boolean>(false);

  getJobsProtocol(
    jobType: ActsBacsAuddisJobType,
    pageNumber: number
  ): Observable<ActsBacsAuddisApiResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', ACTS_BACS_AUDDIS_PAGE_SIZE);

    this.isLoading.set(true);
    this.hasError.set(false);

    return this.http
      .get<ActsBacsAuddisApiResponse>(`/api/acts-bacs-auddis/${jobType}`, { params })
      .pipe(
        shareReplay(1),
        catchError(() => {
          this.hasError.set(true);
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false))
      );
  }

  buildDownloadUrl(
    document: { fileName: string; fileExtension: string; entityId: string },
    entity: string
  ): string {
    return (
      `service/onlyoffice/download` +
      `?filename=${document.fileName}${document.fileExtension}` +
      `&entity=${entity}` +
      `&entityid=${document.entityId}`
    );
  }

  isOverviewDocument(filePath: string): boolean {
    return filePath.indexOf('acts-bacs-auddis-overview') !== -1;
  }

  getJobStatus(isSuccessful: boolean): string {
    return isSuccessful ? 'SUCCESSFUL' : 'UNSUCCESSFUL';
  }

  getCsvFilename(showActsDunning: boolean): string {
    return showActsDunning
      ? 'acts-dunning-overview.csv'
      : 'acts-bacs-auddis-overview.csv';
  }

  accumulateResults(
    existing: ActsBacsAuddisJob[],
    incoming: ActsBacsAuddisJob[],
    currentPage: number
  ): ActsBacsAuddisJob[] {
    return currentPage > 1 ? [...existing, ...incoming] : incoming;
  }
}
