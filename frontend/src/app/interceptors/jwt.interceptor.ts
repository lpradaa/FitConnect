import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Buscamos el token en el almacenamiento del navegador
  const token = localStorage.getItem('token');

  // Si el token existe, clonamos la petición y le inyectamos la cabecera Authorization
  if (token) {
    const clonReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonReq);
  }

  // Si no hay token (como en el registro o login), la petición sigue su curso normal
  return next(req);
};