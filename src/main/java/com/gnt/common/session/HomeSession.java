package com.gnt.common.session;

import java.io.Serializable;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import com.gnt.http.form.HomeForm;

import lombok.Data;

@Data
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class HomeSession implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private HomeForm homeForm;
}

