package com.gnt.common.auth;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.gnt.domain.entity.MLoginUserEntity;

import lombok.Getter;

public class SimpleUserDetails extends org.springframework.security.core.userdetails.User{
	private static final long serialVersionUID = 1L;
	
	@Getter
	private MLoginUserEntity user;
	
	public SimpleUserDetails(MLoginUserEntity user) {
		super(user.getLoginId(), user.getPassword(), StringUtils.equals(user.getDeleteFlg(),"0"), true, true, true,
				convertGrantedAuthorities(user.getRoles()));
		this.user = user;
	}
	
	static Set<GrantedAuthority> convertGrantedAuthorities(String roles){
	    if (roles == null || roles.isEmpty()) {
	        return Collections.emptySet();
	      }
	      Set<GrantedAuthority> authorities = Stream.of(roles.split(","))
	          .map(SimpleGrantedAuthority::new)
	          .collect(Collectors.toSet());
	      return authorities;		
	}
}
