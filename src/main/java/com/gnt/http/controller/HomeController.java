package com.gnt.http.controller;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.thymeleaf.util.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.gnt.common.auth.SimpleUserDetails;
import com.gnt.common.constant.Const;
import com.gnt.common.constant.Const.EContanerType;
import com.gnt.common.session.HomeSession;
import com.gnt.common.util.Utils;
import com.gnt.domain.entity.TTaskBarEntity;
import com.gnt.http.form.HomeForm;
import com.gnt.service.HomeService;

@Controller
@RequestMapping("/home")
public class HomeController {
	
	@Autowired
	HomeSession session;
	
	@Autowired
	HomeService homeService;
	
	@GetMapping
	public String index(@AuthenticationPrincipal SimpleUserDetails loginUser, Model model) throws JsonProcessingException, ParseException {
		HomeForm form = null;
		
		// セッションにデータが残っていた場合そのまま使う
		if(session.getHomeForm() != null) {
			form = session.getHomeForm();
			if(StringUtils.equals(form.getContainsType(), EContanerType.MENU.getType() )) {
				form = homeService.initHomeForm(loginUser.getUser());
			}if(StringUtils.equals(form.getContainsType(), EContanerType.GROUP.getType() )) {
				homeService.setGroup(form, loginUser.getUser());
				
			}else if(StringUtils.equals(form.getContainsType(), EContanerType.PROJECT.getType() )) {
				homeService.setProject(form, loginUser.getUser());
			}
			session.setHomeForm(form);
		}else {
			form = homeService.initHomeForm(loginUser.getUser());
			session.setHomeForm(form);
		}
		
		
		model.addAttribute(Const.EInputID.BRIDGE_BOX.getId(), Utils.objectToJson(form));
		
		return "homeView";
	}
	
	@PostMapping("/changeView")
	public ResponseEntity<String> nextView(@AuthenticationPrincipal SimpleUserDetails loginUser, Model model,@RequestParam(value="bridgeBox") String bridgeBox) throws JsonProcessingException, ParseException {
		HomeForm form =Utils.jsonToObject(bridgeBox, HomeForm.class);
		
		if(form == null) {
			ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(StringUtils.concat("不正なリクエストです：", bridgeBox));
		}
		if(StringUtils.equals(form.getContainsType(), EContanerType.MENU.getType() )) {
			form = homeService.initHomeForm(loginUser.getUser());

		}else if(StringUtils.equals(form.getContainsType(), EContanerType.GROUP.getType() )) {
			homeService.setGroup(form, loginUser.getUser());
			
		}else if(StringUtils.equals(form.getContainsType(), EContanerType.PROJECT.getType() )) {
			homeService.setProject(form, loginUser.getUser());
		}
		session.setHomeForm(form);
		
		return ResponseEntity.ok(Utils.objectToJson(form));
	}

	@PostMapping("/updatePlanDate")
	public ResponseEntity<String> updatePlanDate(@AuthenticationPrincipal SimpleUserDetails loginUser, Model model,@RequestParam(value="bridgeBox") String bridgeBox) throws JsonProcessingException {
		TTaskBarEntity entity =Utils.jsonToObject(bridgeBox, TTaskBarEntity.class);
		
		if(entity == null) {
			ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(StringUtils.concat("不正なリクエストです：", bridgeBox));
		}
		
		homeService.updatePlanDate(entity);
		
		return ResponseEntity.ok("SUCCESS");
	}

	@PostMapping("/updateTaskBar")
	public ResponseEntity<String> updateTaskBar(@AuthenticationPrincipal SimpleUserDetails loginUser, Model model,@RequestParam(value="bridgeBox") String bridgeBox) throws JsonProcessingException {
		TTaskBarEntity entity =Utils.jsonToObject(bridgeBox, TTaskBarEntity.class);
		
		if(entity == null) {
			ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(StringUtils.concat("不正なリクエストです：", bridgeBox));
		}
		
		homeService.updateTaskBar(entity);
		
		return ResponseEntity.ok("SUCCESS");
	}
	
	@PostMapping("/pushFavo")
	public ResponseEntity<String> pushFavo(@AuthenticationPrincipal SimpleUserDetails loginUser, Model model,@RequestParam(value="bridgeBox") String bridgeBox ) throws JsonProcessingException {
		HomeForm form = Utils.jsonToObject(bridgeBox, HomeForm.class);
		
		
		homeService.pushFavo(form, loginUser.getUser());
		
		return ResponseEntity.ok("SUCCESS");
	}
	
	


}
