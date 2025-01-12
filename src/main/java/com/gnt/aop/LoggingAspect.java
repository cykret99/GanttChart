package com.gnt.aop;

import java.util.Arrays;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
	@AfterThrowing(value = "execution(* com.gnt..*.*(..))", throwing = "e")
	public void afterException(JoinPoint joinPoint, Throwable e) throws ClassNotFoundException{
		if(e.getClass().getClassLoader() != null && UsernameNotFoundException.class == e.getClass()
				.getClassLoader().loadClass("org.springframework.security.core.userdetails.UsernameNotFoundException"))
			return ;
		
		Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
		String string = joinPoint.getSignature().getName();
		String args = Arrays.toString(joinPoint.getArgs());
		
		logger.error(string + args, e);
	}
}
