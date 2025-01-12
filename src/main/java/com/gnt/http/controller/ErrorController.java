package com.gnt.http.controller;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.gnt.common.util.Utils;

@Controller
@RequestMapping("/error")
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {
	
	/**
	 * エラーページのパスを返す。
	 *
	 * @return エラーページのパス
	 */
	public String getErrorPath() {
		return "/error";
	}

	
	public static Map<String, Object> getErrorAttributes(HttpServletRequest req){
		
		ServletWebRequest swr = new ServletWebRequest(req);
		DefaultErrorAttributes dea = new DefaultErrorAttributes();
		ErrorAttributeOptions eao = ErrorAttributeOptions.of(
				ErrorAttributeOptions.Include.BINDING_ERRORS,
				ErrorAttributeOptions.Include.EXCEPTION,
				ErrorAttributeOptions.Include.MESSAGE,
				ErrorAttributeOptions.Include.STACK_TRACE);
		return dea.getErrorAttributes(swr, eao);
	}
	
	/**
	 * レスポンス用の ModelAndView オブジェクトを返す。
	 *
	 * @param req リクエスト情報
	 * @param mav レスポンス情報
	 * @return HTML レスポンス用の ModelAndView オブジェクト
	 * @throws JsonProcessingException 
	 */
	@RequestMapping
	public ModelAndView error(HttpServletRequest req, ModelAndView mav) throws JsonProcessingException {
		
		// エラー情報の取得
		Map<String, Object> attr = getErrorAttributes(req);
		
		// タイムアウト判定
		if(req.getSession().isNew()) {
			// タイムアウト
			
		}else {
		}
		
		// 描画画面
		mav.setViewName("error");
		mav.addObject("ErrorResponse",Utils.objectToJson(attr));
		System.out.println(attr);

		return mav;
	}
}
