# Quiz

## Yaml
What's wrong with this yaml?
```yaml
zowe:
  setup:
    # MVS data set related configurations
    dataset:
      # **COMMONLY_CUSTOMIZED**
      # where Zowe MVS data sets will be installed
      prefix: IBMUSER.ZOWE.2.16.0
```
## Install
Let's suppose
* `/zowe/runtime` is valid zowe runtime directory
* User has sufficient rights to create `USER.ZOWE.TEST` datasets
* Direct command `/zowe/runtime/bin/zwe install --ds-prefix USER.ZOWE.TEST` ends with success
* Calling the same command from javascript (via [`runme.sh`](runme.sh)) ends with [`result.txt`](result.txt)
* Use [this repository](https://github.com/zowe/zowe-install-packaging/tree/v2.x/staging/bin) for investigation

## C
Review this code, let's suppose `toEBCDIC` exists and working fine:
```c
void printf2(char *formatString, ...){
  va_list argPointer;
  int cnt;
  char text[512];
  va_start(argPointer,formatString);
  cnt = vsnprintf(text,sizeof(text),formatString,argPointer);
  va_end(argPointer);
  toEBCDIC(text,cnt);
  printf("%s\n",text);
}
```
## Another C
Why is this code abending? Under which circumstances?
```c
/* (filename, ccsid) ccsid -1 implies guess best for platform, 0 implies don't translate */
static JSValue xplatformLoadFileUTF8(JSContext *ctx, JSValueConst this_val,
                                     int argc, JSValueConst *argv){
  size_t size;
  size_t length;
  char *buf;

  size_t fLen;
  const char *filename = JS_ToCStringLen(ctx, &fLen, argv[0]);
  if (!filename){
    return JS_EXCEPTION;
  }
  int sourceCCSID;
  JS_ToInt32(ctx, &sourceCCSID, argv[1]);

  buf = (char*)js_load_file(ctx, &length, filename);
 
  if (sourceCCSID < 0){
    char *nativeBuffer = safeMalloc(length+1,"xplatformStringFromBytes");
    memcpy(nativeBuffer,buf,length);
    nativeBuffer[length] = 0;
    convertFromNative(nativeBuffer,length);
    js_free(ctx, buf);
    JSValue ret = JS_NewStringLen(ctx, nativeBuffer, length);
    safeFree(nativeBuffer,length+1);
    return ret;
  } else if (sourceCCSID == 0) {
    return JS_NewStringLen(ctx, buf, length);
  } else {
    printf("string from specific encoding not yet implemented\n");
    return JS_EXCEPTION;
  }
  
}
```
## JCL
This is a JCL template, which could be used for installation. Before submitting this job all `{zowe.*}` variables are replaced with definition from `zowe.yaml`. Is this JCL ok?
Let's suppose:
* `JOB` statement is ok
* All datasets and paths exist
```jcl
//ZWEINSTL JOB 12345678,ZOWEUSER
//*
//* This program and the accompanying materials are made available
//* under the terms of the Eclipse Public License v2.0 which
//* accompanies this distribution, and is available at
//* https://www.eclipse.org/legal/epl-v20.html
//*
//* SPDX-License-Identifier: EPL-2.0
//*
//* Copyright Contributors to the Zowe Project. 2020, 2020
//*
//*********************************************************************
//AUTHCPY EXEC PGM=BPXBATCH
//BPXPRINT DD SYSOUT=*
//STDOUT   DD SYSOUT=*
//STDERR   DD SYSOUT=*
//STDPARM DD *
SH cd {zowe.runtimeDirectory} &&
cd files/SZWESAMP &&
cp * "//'{zowe.setup.dataset.prefix}.SZWESAMP'" &&
cd ../SZWEEXEC &&
cp * "//'{zowe.setup.dataset.prefix}.SZWEEXEC'" &&
cd ../SZWELOAD &&
cp * "//'{zowe.setup.dataset.prefix}.SZWELOAD'" &&
cd ../../components/launcher/bin
cp zowe_launcher "//'{zowe.setup.dataset.prefix}.SZWEAUTH'" &&
cd ../../zss/SAMPLIB &&
cp ZWESASTC ZWESIP00 ZWESISTC ZWESISCH
   "//'{zowe.setup.dataset.prefix}.SZWESAMP'" &&
cd ../LOADLIB &&
cp ZWESIS01 ZWESAUX ZWESISDL
   "//'{zowe.setup.dataset.prefix}.SZWEAUTH'"
/*
```
