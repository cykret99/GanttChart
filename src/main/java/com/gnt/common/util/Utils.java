package com.gnt.common.util;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import org.thymeleaf.util.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Utils {

	/**
	 * JSON文字列へ変換する
	 * 
	 * @param <T>
	 * @param jsonObj JSON変換オブジェクト
	 * @return JSON文字列
	 * @throws JsonProcessingException
	 */
	public static <T> String objectToJson(T jsonObj) throws JsonProcessingException {
		String json;
		ObjectMapper mapper = new ObjectMapper();
		try {
			json = mapper.writeValueAsString(jsonObj);
		} catch (JsonProcessingException e) {
			log.error(StringUtils.concat("JSON変換できませんでした：", Utils.toString(jsonObj)), e);
			throw e;
		}
		return json;
	}

	/**
	 * JSON文字列をクラス変数に変換する
	 * 
	 * @param <T> 戻り値クラス
	 * @param jsonObj JSON変換オブジェクト
	 * @return クラスオブジェクト
	 * @throws JsonProcessingException
	 */
	public static <T> T jsonToObject(String jsonStr, Class<T> clazz) throws JsonProcessingException {
		T json;
		ObjectMapper mapper = new ObjectMapper();
		try {
			json = mapper.readValue(jsonStr, clazz);
		} catch (JsonProcessingException e) {
			log.error(StringUtils.concat("クラス変換できませんでした：", jsonStr), e);
			throw e;
		}
		return json;
	}

	public static String toString(Object str) {
		return str == null ? "" : str.toString();
	}

	public static LocalDate toDate(String dateStr) throws ParseException {
		
		// Stringからjava.time.LocalDateに変換する
		LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		return date;
	}

	/**
	 * 日付比較用。NULLの場合Falseをかえす。
	 * @param base
	 * @param sub
	 * @return true: base < sbu false: base > sub
	 */
	public static boolean beforeDate(LocalDate base, LocalDate sub) {
		if (base == null)
			return false;
		if (sub == null)
			return false;

		return base.isBefore(sub);
	}

	/**
	 * 日付比較用。NULLの場合Falseをかえす。
	 * @param base
	 * @param sub
	 * @return true: base > sbu false: base < sub
	 */
	public static boolean afterDate(LocalDate base, LocalDate sub) {
		if (base == null)
			return false;
		if (sub == null)
			return false;

		return base.isAfter(sub);
	}

	public static Integer compareToDate(LocalDate base, LocalDate sub) {
		if (base == null)
			return null;
		if (sub == null)
			return null;

		return base.compareTo(sub);
	}

	public static Long differenceDays(LocalDate from, LocalDate to) {
		if(from == null)
			return 0L;
		if(to == null)
			return 0L;
		
		return ChronoUnit.DAYS.between(from, to);
	}
	
	public static LocalDate addDate(LocalDate base, int val) {

         
         return base.plusDays(val);
	}
}
