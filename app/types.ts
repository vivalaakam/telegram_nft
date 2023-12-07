export type TelegramPhotoRequest = {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
};

export type TelegramEntityRequest = {
  offset: number;
  length: number;
  type: string;
};

export type TelegramRequest = {
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
      is_premium: boolean;
    };
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      type: string;
    };
    date: number;
    text: string;
    photo: TelegramPhotoRequest[] | undefined;
    entities: TelegramEntityRequest[] | undefined;
    caption: string | undefined;
  };
};
