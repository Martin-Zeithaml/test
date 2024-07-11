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
