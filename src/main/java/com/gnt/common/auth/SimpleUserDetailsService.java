package com.gnt.common.auth;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gnt.domain.entity.MLoginUserEntity;
import com.gnt.domain.mapper.MLoginUserMapper;

@Service
public class SimpleUserDetailsService implements UserDetailsService{
	
	@Autowired
	MLoginUserMapper mapper;

	@Transactional(readOnly = true)
	@Override
	public UserDetails loadUserByUsername(String loginID) throws UsernameNotFoundException {
		assert (loginID != null);
		
		MLoginUserEntity userinfo = mapper.selectLoginUserByLoginId(loginID);

		if(userinfo == null) {
			throw new UsernameNotFoundException("ユーザーが見つかりません Login ID:[" + loginID + "]");
		}
			
		
		return new SimpleUserDetails(userinfo);
	}
}
