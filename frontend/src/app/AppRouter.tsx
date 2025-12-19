import React from 'react';
import { MetricsDetailPage } from '../modules/marketing/campañas/mailing/pages/MetricsDetailPage';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { LeadsListPage } from '../modules/marketing/leads/pages/LeadsListPage';
import { LeadCapturePage } from '../modules/marketing/leads/pages/LeadCapturePage';
import { LeadDetailPage } from '../modules/marketing/leads/pages/LeadDetailPage';
import { LeadImportPage } from '../modules/marketing/leads/pages/LeadImportPage';
import { SegmentationPage } from '../modules/marketing/segmentacion/pages/SegmentationPage';
import { CreateSegmentPage } from '../modules/marketing/segmentacion/pages/CreateSegmentPage';
import { EditSegmentPage } from '../modules/marketing/segmentacion/pages/EditSegmentPage';
import { CampanasListPage } from '../modules/marketing/campañas/gestor/pages/CampanasListPage';
import { TelemarketingRoutes } from '../modules/marketing/campañas/telefonicas';
import { MailingListPage } from '../modules/marketing/campañas/mailing/pages/MailingListPage';
import { MailingEditorPage } from '../modules/marketing/campañas/mailing/pages/MailingEditorPage';
import { LeadsProvider } from '../modules/marketing/leads/context/LeadsContext';
import { ImportHistoryProvider } from '../modules/marketing/leads/context/ImportHistoryContext';
import { SegmentosProvider } from '../modules/marketing/segmentacion/context/SegmentosContext';
import { CampaignsProvider } from '../modules/marketing/campañas/telefonicas/context/CampaignsContext';
import { ToastProvider } from '../shared/components/ui/Toast';
import { EncuestaPage } from '../modules/marketing/campañas/encuestas/EncuestaPage';
import { CreateEncuestaPage } from '../modules/marketing/campañas/encuestas/pages/CreateEncuestaPage';
import { ViewEncuestaPage } from '../modules/marketing/campañas/encuestas/pages/ViewEncuestaPage';
import { CampanasGestorProvider } from '../modules/marketing/campañas/gestor/context/CampanasGestorContext';
import { EncuestasProvider } from '../modules/marketing/campañas/encuestas/context/EncuestasContext';
import { AuthProvider } from '../shared/context/AuthContext';
import { LoginPage } from './auth/LoginPage';
import { ProtectedRoute } from '../shared/components/routing/ProtectedRoute';
import { MailingProvider } from '../modules/marketing/campañas/mailing/context/MailingContext';
import { HubPage } from './hub/HubPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <MailingProvider>
            <SegmentosProvider>
              <LeadsProvider>
                <CampaignsProvider>
                  <ImportHistoryProvider>
                    <CampanasGestorProvider>
                      <EncuestasProvider>
                        <Routes>
                          {/* Ruta pública del Hub */}
                          <Route path="/" element={<HubPage />} />

                          {/* Ruta pública de Login */}
                          <Route path="/login" element={<LoginPage />} />

                          {/* Rutas Protegidas - Módulo de Marketing */}
                          <Route path="/marketing" element={
                            <ProtectedRoute>
                              <MainLayout />
                            </ProtectedRoute>
                          }>
                            <Route index element={<Navigate to="/marketing/leads" replace />} />

                            {/* Rutas de Leads */}
                            <Route path="leads" element={<LeadsListPage />} />
                            <Route path="leads/new" element={
                              <ProtectedRoute requiredRole="ADMIN">
                                <LeadCapturePage />
                              </ProtectedRoute>
                            } />
                            <Route path="leads/import" element={
                              <ProtectedRoute requiredRole="ADMIN">
                                <LeadImportPage />
                              </ProtectedRoute>
                            } />
                            <Route path="leads/:id" element={<LeadDetailPage />} />

                            {/* Rutas de Segmentación */}
                            <Route path="segmentacion" element={<Outlet />}>
                              <Route index element={<SegmentationPage />} />
                              <Route path="new" element={
                                <ProtectedRoute requiredRole="ADMIN">
                                  <CreateSegmentPage />
                                </ProtectedRoute>
                              } />
                              <Route path="edit/:id" element={
                                <ProtectedRoute requiredRole="ADMIN">
                                  <EditSegmentPage />
                                </ProtectedRoute>
                              } />
                            </Route>

                            {/* Rutas de Encuestas */}
                            <Route path="encuestas" element={<EncuestaPage />} />
                            <Route path="encuestas/new" element={
                              <ProtectedRoute requiredRole="ADMIN">
                                <CreateEncuestaPage />
                              </ProtectedRoute>
                            } />
                            <Route path="encuestas/edit/:id" element={
                              <ProtectedRoute requiredRole="ADMIN">
                                <CreateEncuestaPage />
                              </ProtectedRoute>
                            } />
                            <Route path="encuestas/view/:id" element={<ViewEncuestaPage />} />

                            {/* Rutas de Campañas - Solo ADMIN */}
                            <Route path="campanas/:tab?" element={
                              <ProtectedRoute requiredRole="ADMIN">
                                <CampanasListPage />
                              </ProtectedRoute>
                            } />

                            {/* Rutas de Campañas de Mailing */}
                            <Route path="campanas/mailing" element={
                              <ProtectedRoute requiredModule="MAILING">
                                <MailingListPage />
                              </ProtectedRoute>
                            } />
                            <Route path="campanas/mailing/:id/edit" element={
                              <ProtectedRoute requiredRole="ADMIN" requiredModule="MAILING">
                                <MailingEditorPage />
                              </ProtectedRoute>
                            } />
                            <Route path="campanas/mailing/:id/metricas" element={
                              <ProtectedRoute requiredModule="MAILING">
                                <MetricsDetailPage />
                              </ProtectedRoute>
                            } />

                            {/* Alias para acceder por /emailing (compatibilidad con Sidebar) */}
                            <Route path="emailing" element={
                              <ProtectedRoute requiredModule="MAILING">
                                <MailingListPage />
                              </ProtectedRoute>
                            } />
                            <Route path="emailing/:id/edit" element={
                              <ProtectedRoute requiredRole="ADMIN" requiredModule="MAILING">
                                <MailingEditorPage />
                              </ProtectedRoute>
                            } />
                            <Route path="emailing/:id/metricas" element={
                              <ProtectedRoute requiredModule="MAILING">
                                <MetricsDetailPage />
                              </ProtectedRoute>
                            } />

                            {/* Rutas de Campañas Telefónicas */}
                            <Route path="campanas/telefonicas/*" element={
                              <ProtectedRoute requiredModule="TELEFONIA">
                                <TelemarketingRoutes />
                              </ProtectedRoute>
                            } />
                          </Route>

                          {/* Redirect legacy routes to new marketing routes */}
                          <Route path="/leads/*" element={<Navigate to="/marketing/leads" replace />} />
                          <Route path="/encuestas/*" element={<Navigate to="/marketing/encuestas" replace />} />
                        </Routes>
                      </EncuestasProvider>
                    </CampanasGestorProvider>
                  </ImportHistoryProvider>
                </CampaignsProvider>
              </LeadsProvider>
            </SegmentosProvider>
          </MailingProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
