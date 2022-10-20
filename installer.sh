#!/bin/bash
RED="\033[0;31m"; BLUE="\033[0;34m"; DEFAULTC="\033[0m"
printf "
Welcome to the BEARTELL ${RED}Bigtop${DEFAULTC} installer

"
# Install Dependencies
#sudo yum -y install git

# Install Puppet
sudo rpm -ivh http://yum.puppetlabs.com/puppet5-release-el-8.noarch.rpm
sudo yum -y install puppet
/opt/puppetlabs/bin/puppet module install puppetlabs-stdlib --version 4.12.0


# Install Bigtop Puppet
#sudo git clone https://github.com/apache/bigtop.git /bigtop-home 
#sudo sh -c "cd /bigtop-home; git checkout release-3.1.1"
echo 'hieradata copied'

sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/
sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/
sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/
sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/
sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/
sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/
sleep 10
sudo find /etc/puppet
sudo cp /bigtop-home/bigtop-deploy/puppet/hiera.yaml /etc/puppet/


sudo find /etc/puppet
sleep 10
# Configure
sudo su root -c "cat > /etc/puppet/hieradata/site.yaml << EOF
---
bigtop::hadoop_head_node: "rocky1"
hadoop::hadoop_storage_dirs:
- /home/data
hadoop_cluster_node::cluster_components:
- hdfs
- hbase
- zookeeper
- yarn
bigtop::jdk_package_name: "java-1.8.0-openjdk-devel.x86_64"
bigtop::bigtop_repo_uri: "http://repos.bigtop.apache.org/releases/3.1.1/rockylinux/8/x86_64"
EOF
"


# Deploy 
echo 'Puppet apply started'
sleep 2
/opt/puppetlabs/bin/puppet apply --hiera_config=/etc/puppet/hiera.yaml --modulepath=/bigtop-home/bigtop-deploy/puppet/modules:/etc/puppet/modules:/usr/share/puppet/modules:/etc/puppetlabs/code/environments/production/modules /bigtop-home/bigtop-deploy/puppet/manifests