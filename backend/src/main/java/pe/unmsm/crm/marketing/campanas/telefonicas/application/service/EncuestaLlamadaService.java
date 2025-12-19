package pe.unmsm.crm.marketing.campanas.telefonicas.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.unmsm.crm.marketing.campanas.telefonicas.api.dto.EnvioEncuestaDTO;
import pe.unmsm.crm.marketing.campanas.telefonicas.infra.config.EncuestasConfig;
import pe.unmsm.crm.marketing.campanas.telefonicas.infra.jpa.entity.EnvioEncuestaEntity;
import pe.unmsm.crm.marketing.campanas.telefonicas.infra.jpa.repository.EnvioEncuestaRepository;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class EncuestaLlamadaService {

    private final EnvioEncuestaRepository envioEncuestaRepository;
    private final EncuestasConfig encuestasConfig;

    /**
     * Procesa el envío de encuesta (simulado - no envía SMS real)
     */
    @Transactional
    public EnvioEncuestaEntity procesarEnvioEncuesta(
            Integer idLlamada,
            Integer idEncuesta,
            Long idLead,
            String telefono) {
        log.info("Procesando envío de encuesta simulado - Llamada: {}, Encuesta: {}, Lead: {}",
                idLlamada, idEncuesta, idLead);

        // Generar URL única de encuesta
        String urlEncuesta = generarUrlEncuesta(idEncuesta, idLead, idLlamada);

        // Crear registro de envío
        EnvioEncuestaEntity envio = new EnvioEncuestaEntity();
        envio.setIdLlamada(idLlamada);
        envio.setIdEncuesta(idEncuesta);
        envio.setIdLead(idLead);
        envio.setTelefonoDestino(telefono);
        envio.setUrlEncuesta(urlEncuesta);
        envio.setFechaEnvio(LocalDateTime.now());
        envio.setEstado(EnvioEncuestaEntity.EstadoEnvio.ENVIADA); // Simulado: marcar como enviada inmediatamente
        envio.setMetodoComunicacion(EnvioEncuestaEntity.MetodoComunicacion.SMS);

        EnvioEncuestaEntity saved = envioEncuestaRepository.save(envio);

        log.info("Encuesta simulada 'enviada' exitosamente - ID: {}, URL: {}", saved.getId(), urlEncuesta);

        return saved;
    }

    /**
     * Genera URL única de encuesta con token codificado
     */
    public String generarUrlEncuesta(Integer idEncuesta, Long idLead, Integer idLlamada) {
        // Construir URL usando la configuración del frontend de encuestas
        String url = String.format("%s/q/%d/%d",
                encuestasConfig.getFrontendUrl(),
                idEncuesta,
                idLead);

        log.debug("URL de encuesta generada: {}", url);
        return url;
    }

    /**
     * Obtiene los detalles de un envío de encuesta para mostrar en el modal
     */
    public EnvioEncuestaDTO obtenerDetalleEnvio(Integer idLlamada) {
        log.info("Obteniendo detalles de envío de encuesta para llamada: {}", idLlamada);

        return envioEncuestaRepository.findByIdLlamada(idLlamada)
                .map(this::toDTO)
                .orElse(null);
    }

    /**
     * Convierte EnvioEncuestaEntity a DTO
     */
    private EnvioEncuestaDTO toDTO(EnvioEncuestaEntity entity) {
        return EnvioEncuestaDTO.builder()
                .id(entity.getId())
                .idLlamada(entity.getIdLlamada())
                .idEncuesta(entity.getIdEncuesta())
                .idLead(entity.getIdLead())
                .telefonoDestino(entity.getTelefonoDestino())
                .urlEncuesta(sanitizeUrl(entity.getUrlEncuesta()))
                .fechaEnvio(entity.getFechaEnvio())
                .estado(entity.getEstado().name())
                .metodoComunicacion(entity.getMetodoComunicacion().name())
                .mensajeError(entity.getMensajeError())
                // Campos adicionales se pueden poblar con joins si es necesario
                .build();
    }

    /**
     * Sanitiza URLs reemplazando localhost por la URL de producción configurada.
     * Esto permite que URLs antiguas en la BD sigan funcionando.
     */
    private String sanitizeUrl(String url) {
        if (url == null || url.isEmpty()) {
            return url;
        }

        // Reemplazar cualquier URL localhost por la URL de producción
        // Patrones a reemplazar:
        // - http://localhost:5600
        // - http://localhost:8080
        // - http://localhost:{cualquier-puerto}
        String sanitized = url.replaceAll(
                "http://localhost(:[0-9]+)?",
                encuestasConfig.getFrontendUrl());

        if (!sanitized.equals(url)) {
            log.debug("URL sanitizada: {} -> {}", url, sanitized);
        }

        return sanitized;
    }
}
