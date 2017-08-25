#!/bin/bash
rm testrpc.out
testrpc  &> testrpc.out &
pid=$!
truffle test
kill -9 $pid