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
