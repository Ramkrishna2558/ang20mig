/**
 * GAWS-7103: Acts BACS-AUDDIS Migration
 * Model definitions derived from legacy ActsBacsAuddisController response shape.
 * Response path: response.data.ActsBacsAuddis.{ result[], currentPage, totalElements }
 */

export interface ActsBacsAuddisDocument {
  readonly entityId: string;
  readonly filePath: string;
  readonly fileName: string;
  readonly fileExtension: string;
}

export interface ActsBacsAuddisJob {
  readonly id: number;
  readonly jobType: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly isSuccessful: boolean;
  readonly documentName: string;
  readonly info: string;
  readonly documents: ActsBacsAuddisDocument[];
}

export interface ActsBacsAuddisPage {
  readonly result: ActsBacsAuddisJob[];
  readonly currentPage: number;
  readonly totalElements: number;
}

export interface ActsBacsAuddisApiResponse {
  readonly data: {
    readonly ActsBacsAuddis: ActsBacsAuddisPage;
  };
}

export type ActsBacsAuddisJobType = 'acts_bacs_auddis' | 'acts_dunning';

export const ACTS_BACS_AUDDIS_PAGE_SIZE = 50 as const;
export const ACTS_BACS_AUDDIS_JOB_TYPE: ActsBacsAuddisJobType = 'acts_bacs_auddis';
export const ACTS_DUNNING_JOB_TYPE: ActsBacsAuddisJobType = 'acts_dunning';
export const ACTS_BACS_AUDDIS_CSV_FILENAME = 'acts-bacs-auddis-overview.csv' as const;
export const ACTS_DUNNING_CSV_FILENAME = 'acts-dunning-overview.csv' as const;
export const ONLYOFFICE_DOWNLOAD_PATH = 'service/onlyoffice/download' as const;
export const ENTITY_ACTS_BACS_AUDDIS = 'acts-bacs-auddis' as const;
export const ENTITY_ACTS_BACS_AUDDIS_OVERVIEW = 'acts-bacs-auddis-overview' as const;
