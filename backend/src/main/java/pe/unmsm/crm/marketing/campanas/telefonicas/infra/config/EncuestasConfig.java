package pe.unmsm.crm.marketing.campanas.telefonicas.infra.config;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

/**
 * Configuración para URLs de encuestas telefónicas.
 * 
 * Variables de configuración:
 * - ENCUESTAS_FRONTEND_URL: URL base del frontend de encuestas (Vercel)
 */
@Configuration
@Getter
@Slf4j
public class EncuestasConfig {

    @Value("${app.encuestas_frontend.url:https://marketing-crm-k35v.vercel.app}")
    private String frontendUrl;

    @PostConstruct
    public void logConfig() {
        log.info("╔══════════════════════════════════════════════════╗");
        log.info("║  ENCUESTAS CONFIGURADAS                          ║");
        log.info("╠══════════════════════════════════════════════════╣");
        log.info("║  Frontend URL: {}", frontendUrl);
        log.info("╚══════════════════════════════════════════════════╝");
    }
}
