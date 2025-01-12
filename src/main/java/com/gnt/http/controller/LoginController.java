package com.gnt.http.controller;

import javax.naming.AuthenticationException;

import jakarta.servlet.http.HttpSession;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.WebAttributes;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.gnt.common.auth.SimpleUserDetails;
import com.gnt.http.form.MessageForm;

@Controller
public class LoginController {
	
	@GetMapping("/login")
	public String login(HttpSession session,
			@AuthenticationPrincipal SimpleUserDetails loginUser) {
		
		if(session != null) {
			AuthenticationException ex = (AuthenticationException)session.getAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
			
			if(ex == null) {
				if(loginUser != null) {
					// エラーがなく、すでにログインしているなら認証をスキップ
					return "redirect:/home";
				}
			}else {
			}
		}else {
		}
		
		return "login";
	}
	
	@GetMapping("/login-error")
	public String loginError(@ModelAttribute("MessageForm") MessageForm messageForm, HttpSession session,
			@AuthenticationPrincipal SimpleUserDetails loginUser) {
		
		messageForm.setErrorMessage("Login ID または Password が誤っています");
		return "login";
	}
	
}
