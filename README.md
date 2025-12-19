# Marketing CRM

Este proyecto es una plataforma integral de gestión de relaciones con clientes (CRM) especializada en Marketing, diseñada para orquestar campañas multicanal, gestionar leads y optimizar operaciones de telemarketing.

El sistema está construido con una arquitectura moderna, separando el backend (Spring Boot) del frontend (React), y cuenta con integraciones avanzadas como IA, almacenamiento en la nube y comunicación en tiempo real.

## 🚀 Características Principales

### 🎯 Gestión de Campañas
- **Campañas Telefónicas:** Asignación de leads a agentes, scripts de venta dinámicos y seguimiento de estados.
- **Email Marketing:** Integración con **Resend** para envíos masivos y seguimiento de campañas de correo.
- **Encuestas:** Generación y gestión de encuestas dinámicas para evaluar la satisfacción del cliente.

### 📞 Módulo de Telemarketing
- **Cola de Llamadas:** Interfaz optimizada para agentes con gestión de colas de llamadas pausables.
- **Grabaciones:** Almacenamiento seguro de llamadas en **Firebase Storage** con reproducción directa desde la interfaz.
- **Métricas:** Dashboards de rendimiento por agente y campaña.

### 👥 Gestión de Leads y Segmentación
- Importación y exportación masiva de datos (Excel/Apache POI).
- Herramientas de segmentación avanzada para focalizar campañas.

### 🤖 Inteligencia Artificial & Automatización
- Integración con **Google Gemini / Vertex AI** para procesamiento inteligente (análisis de llamadas, generación de contenido, etc.).
- Generación de reportes PDF automatizados.

### 🔒 Seguridad
- Autenticación y Autorización basada en **JWT** (JSON Web Tokens).
- Control de acceso basado en roles (RBAC) para Administradores, Supervisores y Agentes.

## 🛠 Tech Stack

### Backend
- **Lenguaje:** Java 17
- **Framework:** Spring Boot 3.x
- **Base de Datos:** MySQL
- **Seguridad:** Spring Security, JWT
- **Almacenamiento:** Firebase Admin SDK
- **Email:** Resend Java SDK
- **IA:** Google Cloud AI Platform / Gemini
- **Tiempo Real:** WebSockets
- **Documentación:** OpenAPI / Swagger (SpringDoc)
- **Caching:** Caffeine

### Frontend
- **Framework:** React
- **Lenguaje:** TypeScript
- **Build Tool:** Vite
- **Estilos:** TailwindCSS
- **Gráficos:** Recharts (para métricas y dashboards)

## 📂 Estructura del Proyecto

```
Wankas_v2/
├── backend/                # Aplicación Spring Boot (Monolito Modular)
│   ├── src/main/java/pe/unmsm/crm/marketing/
│   │   ├── campanas/       # Lógica de Campañas (Telemarketing, Mailing, Encuestas)
│   │   ├── leads/          # Gestión de Leads
│   │   ├── segmentacion/   # Lógica de Segmentación
│   │   ├── security/       # Configuración de Seguridad y Auth
│   │   └── shared/         # Utilidades y componentes compartidos
│   └── pom.xml             # Dependencias Maven
│
├── frontend/               # Aplicación React + Vite
│   ├── src/modules/marketing/
│   │   ├── campañas/       # Interfaces de gestión de campañas
│   │   ├── analytics/      # Dashboards y reportes
│   │   └── ...
│   └── package.json        # Dependencias NPM
│
└── README.md
```

## ⚡ Guía de Inicio

### Requisitos Previos
- Java 17 o superior
- Node.js (v18+ recomendado)
- MySQL Server
- Credenciales de Firebase y Resend (configuradas en variables de entorno)

### Backend Setup
1. Navega al directorio `backend`.
2. Configura tu base de datos en `application.properties` o variables de entorno.
3. Ejecuta la aplicación:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navega al directorio `frontend`.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📄 Integrantes
Castilla Huanca Marco Renato
Cueva Alcala Axel Andree
Poma Gutierrez Gabriel
Taco Zavala Miguel Angel
Basualdo Ale Marcos Luis
De la Cruz Meza Angel Luis Kallpa
