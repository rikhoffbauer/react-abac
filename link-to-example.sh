#!/usr/bin/env sh

project_dir=$(pwd)
example_dir=${project_dir}/example
node_modules=${project_dir}/node_modules

function link_dependency() {
    name=$1
    echo "Linking $name to example"
    cd ${node_modules}/${name} && npm link > /dev/null 2>&1 && cd ${example_dir} && npm link ${name}  > /dev/null 2>&1
}

# Use same react instance as library
link_dependency react
