
import { DropboxAPI } from './DropboxAPI';

export class DropboxFileManagerService {
  constructor(private api: DropboxAPI) {}

  // Método genérico para obtener cualquier archivo
  async getFile(accessToken: string, filePath: string): Promise<any | null> {
    try {
      const response = await this.api.downloadFile(accessToken, filePath);

      if (response.status === 409) {
        // File doesn't exist
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to read file: ${filePath}`);
      }

      const jsonContent = await response.text();
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return null;
    }
  }

  // Método genérico para actualizar cualquier archivo
  // Confía en que los datos locales están correctos, no descarga primero
  async updateFile(accessToken: string, filePath: string, data: any): Promise<boolean> {
    try {
      const response = await this.api.uploadFile(
        accessToken,
        filePath,
        JSON.stringify(data, null, 2),
        'overwrite'
      );

      return response.ok;
    } catch (error) {
      console.error(`Error updating file ${filePath}:`, error);
      return false;
    }
  }

  async deleteFile(accessToken: string, filePath: string): Promise<boolean> {
    try {
      const response = await this.api.deleteFile(accessToken, filePath);
      return response.ok;
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      return false;
    }
  }
}
