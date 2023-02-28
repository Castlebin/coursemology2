import BaseAPI from './Base';

class AttachmentsAPI extends BaseAPI {
  delete(attachmentId) {
    return this.getClient().delete(
      `${AttachmentsAPI.#urlPrefix}/${attachmentId}`,
    );
  }

  static get #urlPrefix() {
    return '/attachments';
  }
}

const attachmentsAPI = new AttachmentsAPI();

export default attachmentsAPI;
