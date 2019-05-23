#!/usr/bin/env bash
# variables assignment
[ ! -z "$1" ] && RANGE_USERS_INIT=$1 || START_USERS_INDEX=40
[ ! -z "$2" ] && RANGE_USERS_END=$2 || echo "NULL"
[ ! -z "$3" ] && HOST=$3 || HOST="http://localhost:8000"
[ ! -z "$4" ] && GROUP=$4 || GROUP="user"

# Login to get JWT Token

DOJOT_USERNAME='admin'
DOJOT_PASSWD='admin'

JWT=$(curl --silent -X POST ${HOST}/auth \
-H "Content-Type:application/json" \
-d "{\"username\": \"${DOJOT_USERNAME}\", \"passwd\" : \"${DOJOT_PASSWD}\"}" | jq '.jwt' | tr -d '"')

echo "|-------------------------------------------------------------------------|";
echo "|                                                                         |";
echo "|              USERNAME              |              NEW PSWD              |";

for i in $(seq ${RANGE_USERS_INIT} ${RANGE_USERS_END});
do
    JSON_CREATE_USER='{"username":"usertest'"${i}"'","service":"usertest'"${i}"'","email":"usertest'"${i}"'@noemail.com","name":"test'"${i}"'","profile":"'"$GROUP"'"}'

    # request to create user
    CREATE_USER_RESPONSE=$( curl \
    -H "Content-Type:application/json" \
    -H "Connection:keep-alive" \
    -H "Authorization:Bearer ${JWT}" \
    --silent \
    -X POST \
    --data ${JSON_CREATE_USER} \
    ${HOST}/auth/user/)


    # extract the status
    # CREATE_USER_STATUS=$(echo ${CREATE_USER_RESPONSE} | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    # print message based on status
    # if [ ! ${CREATE_USER_STATUS} -eq '200'  ]; then
    #     echo "RESPONSE: ${CREATE_USER_RESPONSE}";
    #     echo "Error [HTTP status: ${CREATE_USER_STATUS}]";
    #     exit 1
    # fi


    # Request to login with user to get his JWT Token
    LOGIN_USER_RESPONSE=$(curl \
    -H 'Content-Type: application/json' \
    --silent \
    -X POST \
    --data '{"username":"usertest'"${i}"'","passwd": "temppwd"}' \
    ${HOST}/auth/)

    # extract the status
    # LOGIN_USER_STATUS=$(echo ${LOGIN_USER_RESPONSE} | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    # extract the token
    LOGGED_USER_TOKEN=$(echo ${LOGIN_USER_RESPONSE} | jq '.jwt')

    # print message based on status
    # if [ ! ${LOGIN_USER_STATUS} -eq '200'  ]; then
    #     echo "RESPONSE: ${LOGIN_USER_RESPONSE}";
    #     echo "Error [HTTP status: ${LOGIN_USER_STATUS}]";
    #     exit 1
    # fi

    #json object to change password
    JSON_CHANGE_PSWD_OBJ='{"oldpasswd":"temppwd","newpasswd":"newusrpswd'${i}'"}'

    #request to change password
    CHANGE_USER_PSWD_RESPONSE=$(curl \
    -H "Content-Type:application/json" \
    -H "Connection:keep-alive" \
    -H "Authorization:Bearer '${LOGGED_USER_TOKEN}'" \
    --silent \
    -X POST \
    --data ${JSON_CHANGE_PSWD_OBJ} \
    ${HOST}/auth/password/update/)


    # extract the status from response to change user pswd
    # PSWD_USER_STATUS=$(echo ${CHANGE_USER_PSWD_RESPONSE} | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    # print message based on status
    # if [ ! ${PSWD_USER_STATUS} -eq '200'  ]; then
    #     echo "RESPONSE: ${CHANGE_USER_PSWD_RESPONSE}";
    #     echo "Error [HTTP status: ${PSWD_USER_STATUS}]";
    #     exit 1
    # else

        echo "|            usertest'"${i}"'           |            newusrpswd'${i}'           |";
        echo "|                                                                         |";
        echo "|-------------------------------------------------------------------------|";
    # fi
done
