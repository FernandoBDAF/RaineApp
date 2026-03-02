/**
 * Avatar padrão para perfis sem foto no Firestore.
 * Usar como source em <Image> quando photoURL for vazio.
 */
export const DEFAULT_AVATAR_SOURCE = require('../../assets/default-avatar-profile.jpg');

export type ImageSource = { uri: string } | number;

/**
 * Retorna source para <Image>: uri se existir, senão o avatar padrão.
 */
export function getAvatarSource(photoURL: string | undefined | null): ImageSource {
  if (photoURL && photoURL.trim()) {
    return { uri: photoURL.trim() };
  }
  return DEFAULT_AVATAR_SOURCE;
}
