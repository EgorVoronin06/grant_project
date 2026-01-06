import IMask from 'imask';

export const maskedPhone = (phone: string) => IMask.pipe(phone, { mask: '+7(000)000-00-00' });
