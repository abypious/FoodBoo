package com.fooboo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.Components;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("FooBoo Internal Food Booking System API")
                        .description("""
                                This API powers the internal food booking platform used by employees and administrators
                                within FooBoo. The system allows employees to browse available meals, make bookings,
                                accumulate points, submit reviews, and manage their reservations.

                                Administrators can manage food items, categories, availability, employee accounts,
                                and view system-wide analytics.  
                                
                                ## Key Features
                                - **JWT-based authentication** for secure API access  
                                - **Role-based authorization** (EMPLOYEE, ADMIN)  
                                - **Meal booking engine** with duplicate-booking prevention  
                                - **Food item & category management**  
                                - **Review and rating system**  
                                - **Employee points & rewards tracking**  
                                - **Comprehensive admin controls**  

                                ## Notes
                                - All secured endpoints require a valid JWT token.  
                                - Use the login endpoint to obtain a token before calling protected APIs.  
                                - This documentation is intended for internal development and integration only.
                                """)
                        .version("1.0.0"))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(
                        new Components().addSecuritySchemes(
                                securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )
                );
    }
}
