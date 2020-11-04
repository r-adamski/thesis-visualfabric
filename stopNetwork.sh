#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -ex

starttime=$(date +%s)

# Bring the test network down
pushd ../test-network
./network.sh down
popd

# clean out any old identites in the wallets
rm -rf wallet
rm -rf addAssets.json


cat <<EOF

Total cleaning network execution time : $(($(date +%s) - starttime)) secs ...

EOF