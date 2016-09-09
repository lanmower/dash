FROM abernix/meteord:base 
RUN apt-get install graphicsmagick -y
RUN apt-get install wget -y
RUN wget https://raw.githubusercontent.com/notDavid/full-ffmpeg-in-debian-wheezy/master/buildffmpeg.sh -O /tmp/ffmpeg.sh -O /tmp/ffmpeg.sh
RUN chmod +x /tmp/ffmpeg.sh
RUN /tmp/ffmpeg.sh
