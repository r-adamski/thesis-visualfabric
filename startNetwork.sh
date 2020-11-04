#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e pipefail

starttime=$(date +%s)

# launch network; create channel and join peer to channel
pushd ../test-network
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn basic -ccl javascript

popd

cat <<EOF

Total setup execution time : $(($(date +%s) - starttime)) secs ...

EOF