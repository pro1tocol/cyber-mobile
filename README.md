# DUK技术栈-v3.8.297

### Create new pages
``` shell
    tar -cvf html.tar ./*
```

### Update pages
``` shell
    mv html.tar html_date.tar
    tar -xvf html_date.tar
    git add . && git commit -m " " && git push
    rm -rf 404 about archives assets avatar baidusitemap.xml content.json css font index.html intro lib page/ s scripts sitemap.txt sitemap.xml static 
    tar -xvf html_date.tar
    git status
    # it's maybe to work
```
