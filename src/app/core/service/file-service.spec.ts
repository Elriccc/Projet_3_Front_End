import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FileService } from './file.service';
import { UploadFile } from '../model/UploadFile';
import { DownloadFile } from '../model/DownloadFile';

const mockDownloadFile: DownloadFile = {
  fileLink: 'abc123',
  name: 'mon-fichier',
  extension: 'pdf',
  size: 204800,
  usePassword: false,
  daysUntilExpired: 5,
  tags: [],
};

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.setItem('accessToken', 'token-test');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService],
    });

    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  describe('upload()', () => {
    it('doit faire un POST /api/files avec le FormData', () => {
      const uploadFile: UploadFile = {
        password: 'secret',
        expirationTime: 7,
        file: new File(['contenu'], 'test.pdf', { type: 'application/pdf' }),
      };

      service.upload(uploadFile).subscribe((res) => {
        expect(res).toEqual(mockDownloadFile);
      });

      const req = httpMock.expectOne('/api/files');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer token-test');
      req.flush(mockDownloadFile);
    });
  });

  describe('retrieveAllFiles()', () => {
    it('doit faire un GET /api/files et retourner un tableau', () => {
      service.retrieveAllFiles().subscribe((files) => {
        expect(files).toEqual([mockDownloadFile]);
      });

      const req = httpMock.expectOne('/api/files');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer token-test');
      req.flush([mockDownloadFile]);
    });

    it('doit retourner un tableau vide si aucun fichier', () => {
      service.retrieveAllFiles().subscribe((files) => {
        expect(files).toEqual([]);
      });

      const req = httpMock.expectOne('/api/files');
      req.flush([]);
    });
  });

  describe('retrieveFileByLink()', () => {
    it('doit faire un GET /api/files/:link', () => {
      service.retrieveFileByLink('abc123').subscribe((file) => {
        expect(file).toEqual(mockDownloadFile);
      });

      const req = httpMock.expectOne('/api/files/abc123');
      expect(req.request.method).toBe('GET');
      req.flush(mockDownloadFile);
    });
  });

  describe('download()', () => {
    it('doit faire un POST /api/files/download/:link avec le mot de passe', () => {
      service.download('abc123', 'monMotDePasse').subscribe();

      const req = httpMock.expectOne('/api/files/download/abc123');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe('monMotDePasse');
      expect(req.request.responseType).toBe('blob');
      req.flush(new Blob());
    });

    it('doit accepter un mot de passe undefined', () => {
      service.download('abc123', undefined).subscribe();

      const req = httpMock.expectOne('/api/files/download/abc123');
      expect(req.request.body).toBeNull();
      req.flush(new Blob());
    });
  });

  describe('delete()', () => {
    it('doit faire un DELETE /api/files/:link', () => {
      service.delete('abc123').subscribe();

      const req = httpMock.expectOne('/api/files/abc123');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe('Bearer token-test');
      req.flush({});
    });
  });

  describe('updateTags()', () => {
    it('doit faire un PUT /api/files/:link avec les tags', () => {
      service.updateTags('abc123', ['tag1', 'tag2']).subscribe();

      const req = httpMock.expectOne('/api/files/abc123');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ tags: ['tag1', 'tag2'] });
      req.flush({});
    });

    it('doit accepter un tableau de tags vide', () => {
      service.updateTags('abc123', []).subscribe();

      const req = httpMock.expectOne('/api/files/abc123');
      expect(req.request.body).toEqual({ tags: [] });
      req.flush({});
    });
  });
});