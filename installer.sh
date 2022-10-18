#!/bin/bash
RED="\033[0;31m"; BLUE="\033[0;34m"; DEFAULTC="\033[0m"printf "
Welcome to the BEARTELL ${RED}Bigtop${DEFAULTC} installer

"# Install Dependencies
sudo yum -y install git

# Install Puppet
sudo rpm -ivh http://yum.puppetlabs.com/puppet5-release-el-8.noarch.rpm
sudo yum -y install puppet
sudo /opt/puppetlabs/bin/puppet module install puppetlabs-stdlib


# Install Bigtop Puppet
sudo git clone https://github.com/apache/bigtop.git /bigtop-home
sudo sh -c "cd /bigtop-home; git checkout release-3.1.1"
sudo cp -r /bigtop-home/bigtop-deploy/puppet/hieradata/ /etc/puppet/
sudo cp /bigtop-home/bigtop-deploy/puppet/hiera.yaml /etc/puppet/


# Configure
sudo su root -c "cat > /etc/puppet/hieradata/site.yaml << EOF
---
bigtop::hadoop_head_node: "rockylinux1"
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
sudo /opt/puppetlabs/bin/puppet apply --parser future --modulepath=/bigtop-home/bigtop-deploy/puppet/modules:/etc/puppet/modules /bigtop-home/bigtop-deploy/puppet/manifests