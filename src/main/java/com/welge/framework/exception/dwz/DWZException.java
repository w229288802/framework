package com.welge.framework.exception.dwz;

import javax.servlet.ServletException;

public class DWZException extends ServletException{
	private static final long serialVersionUID = 1L;

	public DWZException(String msg){
		super(msg);
	}
}
