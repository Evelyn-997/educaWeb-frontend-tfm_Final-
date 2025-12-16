# EducaWeb – Frontend (TFM)

## Descripción
Frontend de la plataforma web educativa EducaWeb, desarrollado en Angular
como parte del Trabajo Fin de Máster.

---

## Arquitectura general del proyecto

| Componente          | Tecnología utilizada                         |
| ------------------- | -------------------------------------------- |
| Backend             | Java + Spring Boot + Spring Security         |
| Frontend            | Angular + Bootstrap                          |
| Base de datos       | MySQL                                        |
| Autenticación       | JWT (JSON Web Tokens)                        |
| Gestión de archivos | Almacenamiento local                         |
| Notificaciones      | WebSockets / Email                           |
| Testing             | JUnit + Postman (API)                        |
| Despliegue          | Docker + GitHub                              |

> Este repositorio corresponde únicamente al **Frontend** del sistema.

---

## Tecnologías utilizadas (Frontend)
- Angular  
- TypeScript  
- Bootstrap  
- HTML5 y CSS3  
- RxJS  
- Angular Router  
- JWT para autenticación basada en tokens  

---

### 2. Funcionalidades para el ALUMNADO

#### Registro e inicio de sesión seguro 
- Formulario de registro con rol de estudiante
- Inicio de sesión con validaciones de seguridad

#### Inscripción a cursos/grupos
- Pantalla con listado de cursos disponibles
- Botón de inscripción y visualización de la descripción
- Vista de los cursos en los que el estudiante está inscrito

#### Acceso a documentos
- Listado de documentos disponibles por curso
- Opción de descarga y vista previa
- Indicador visual de “nuevo documento”

#### Recepción de notificaciones
- Notificaciones en tiempo real
- Banner o alerta al recibir nuevas notificaciones
- Sección dedicada para consultar todas las notificaciones

#### Historial de notificaciones
- Página con listado ordenado por fecha
- Filtros por tipo (mensaje, aviso, documento)
- Opción de marcar notificaciones como leídas o no leídas
---

### 3. Funcionalidades comunes

#### Dashboard inicial personalizado
- Profesorado: visualización de cursos impartidos y últimas acciones
- Alumnado: cursos inscritos y notificaciones recientes

#### Gestión del perfil
- Edición de datos personales
- 
#### Seguridad y usabilidad 
- Gestión de sesión mediante JWT con renovación automática
- Redirección según el rol (profesor o estudiante)
- Control de acceso a menús y pantallas según permisos
---

## Instalación y ejecucion del proyecto 
### Requisitos previos
- Node.js (versión recomendada 18 o superior)
- Angular CLI

### Instalacin 
```bash
npm install
ng serve 
```

## Estructura del proyecto
- src/app/auth
- src/app/core
- src/app/interceptors
- src/app/pages
- src/app/student
- src/app/teacher

### Autora
Evelyn Ynachaliquin Gómez
