package com.gnt.common.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig{
	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return web -> web
				.debug(false)
				.ignoring()
				.requestMatchers("/images/**", "/js/**", "/css/**");
	}
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
		http
			.headers(headers -> headers
					.frameOptions(frameOptions -> frameOptions
							.sameOrigin()))
			.authorizeHttpRequests(requests -> requests
					.requestMatchers("/","/error", "/canvas").permitAll()
					.requestMatchers("/home").hasAnyRole("ADMIN", "USER", "MANAGER")
					.anyRequest().authenticated())
			.formLogin(
					login -> login
					.loginProcessingUrl("/login")
					.loginPage("/login").failureUrl("/login-error")
					.usernameParameter("loginID")
					.passwordParameter("password")
					.permitAll()
					.defaultSuccessUrl("/home",true))
			.logout(
					out -> out
					.invalidateHttpSession(true)
					.logoutUrl("/logout")
					.deleteCookies()
					.logoutSuccessUrl("/login"));
	    
	    return http.build();
	}
	

}
