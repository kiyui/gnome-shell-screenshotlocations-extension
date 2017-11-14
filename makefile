default:
	cd ./screenshotlocations.timur@linux.com/ && zip -r ../screenshotlocations.timur@linux.com.zip ./*

copy: 
	cp -rvf screenshotlocations.timur@linux.com/ ~/.local/share/gnome-shell/extensions/
