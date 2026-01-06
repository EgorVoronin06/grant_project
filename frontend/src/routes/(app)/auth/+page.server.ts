import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = ({ cookies, url }) => {
  const access = url.searchParams.get('accessToken')
  const refresh = url.searchParams.get('refreshToken')

  if (access && refresh) {
    cookies.set('refresh', refresh, { path: '/', httpOnly: true, maxAge: 604800 });
    cookies.set('access', access, { path: '/', httpOnly: true });
  }

  redirect(303, '/')
}
