#!/usr/bin/env bash

# update apt
sudo apt update
sudo apt -y install libgmp-dev git

# Ruby
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
\curl -sSL https://get.rvm.io | bash -s stable --ruby=2.3.0
source ~/.rvm/scripts/rvm

# Install jekyll
gem install jekyll

# Create a new Jekyll site if one does not already exists
cd /vagrant
if [ ! -f jekyll/_config.yml ]; then
    jekyll new jekyll
fi

# Run Jekyll, accessible on the host machine
cd jekyll
jekyll serve --detach --host=0.0.0.0