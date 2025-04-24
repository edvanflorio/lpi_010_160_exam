#!/bin/bash
#
# **LPI practice exam**
#
# | Author: Noam Alum
# | Created: Thu 19 Dec 2024 12:36:22 IST
# | Last modified: Sat 22 Feb 2025 19:08:31 IST
# | Description: This file contains Bash script that lets you practice for the LPI practice exam.
#



# | Style
LPI_BANNER="<bic>

    ██╗     ██████╗ ██╗    ███████╗██╗  ██╗ █████╗ ███╗   ███╗
    ██║     ██╔══██╗██║    ██╔════╝╚██╗██╔╝██╔══██╗████╗ ████║
    ██║     ██████╔╝██║    █████╗   ╚███╔╝ ███████║██╔████╔██║
    ██║     ██╔═══╝ ██║    ██╔══╝   ██╔██╗ ██╔══██║██║╚██╔╝██║
    ███████╗██║     ██║    ███████╗██╔╝ ██╗██║  ██║██║ ╚═╝ ██║
    ╚══════╝╚═╝     ╚═╝    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
</bic>

<biw>
   ┌────────────────────────────────────────────────────────────────────────────────┐
   │  Consider sponsoring the project here: </biw><bibl>https://github.com/sponsors/Noam-Alum</bibl><biw>   │
   │                                                                                │
   │                 Thank you, I hope you do well on the exam! </biw><bir>❤️</bir><biw>                   │
   └────────────────────────────────────────────────────────────────────────────────┘

</biw>
"
SUCCESS_BULLET=" <big>{{ B-arrow }}</big>"
FAIL_BULLET=" <bir>{{ B-arrow }}</bir>"
INFO_BULLET=" <biw>{{ B-arrow }}</biw>"
readonly LPI_BANNER SUCCESS_BULLET FAIL_BULLET INFO_BULLET



# | Fetch utils.sh
# shellcheck disable=SC1090
source <(curl -Ls "https://raw.githubusercontent.com/Noam-Alum/utils.sh/main/utils.sh")

# | Functions
function fail {
  local ERR_CODE ERR_MSG

	if [ -z "$1" ]; then ERR_CODE="4"; else ERR_CODE="$1"; fi
	if [ -z "$2" ]; then ERR_MSG=":\nNo error specified.";else ERR_MSG="$2"; fi
	xecho "$FAIL_BULLET <biw>$ERR_MSG</biw>\n" >&2

  # Exit even if a fork is calling fail
  if [ "$BASH_SUBSHELL" -gt 0 ]; then
    xecho "$FAIL_BULLET <biw>$ERR_MSG, Exit code should be:</biw> <on_ib><biw>$ERR_CODE</biw></on_ib>\n" >&2
    pkill --signal 9 -f "$(basename "$0")"
  fi

  exit "$ERR_CODE"
}

function array_contains {
  local ITEM ARRAY_ITEMS

  ITEM="$1"
  shift 1
  ARRAY_ITEMS=("$@")

  for ARRAY_ITEM in "${ARRAY_ITEMS[@]}"
  do
    [[ "$ARRAY_ITEM" = "$ITEM" ]] && return 0
  done

  # Could not find item in array
  return 1
}

function get_random_function_id {
  local MAX_TTL RES GEN_RANDOM_RESPONSE MAX ITERATION_COUNT

  if [ -z "$1" ]; then fail 1 "No max number given for ${FUNCNAME[0]} !"; else MAX="$1";fi
  MAX_TTL=15
  ITERATION_COUNT=0

  while [ -z "$RES" ] && [ "$ITERATION_COUNT" -lt "$MAX_TTL" ]
  do
    GEN_RANDOM_RESPONSE="$(( RANDOM % $(( MAX + 1 )) ))"
    if ! array_contains "$(( $GEN_RANDOM_RESPONSE + 1 ))" "${ASKED_QUESTIONS[@]}" && [[ "$GEN_RANDOM_RESPONSE" -le "$MAX" ]]; then
      RES="$GEN_RANDOM_RESPONSE"
    fi
    (( ITERATION_COUNT++ ))
  done

  echo "${RES:-0}"
}

# | Set environment
xecho "$LPI_BANNER"
xecho "<biw>{{ BR-scissors }} Setting environment ...</biw>\n"
## Check for jq
which jq &> /dev/null || fail 1 "jq not found, please install and try again."

## Fetch data
LPI_QUESTIONS_URL="https://raw.githubusercontent.com/Noam-Alum/lpi_010_160_exam/refs/heads/main/lpi/lpi_questions.json"
readonly LPI_QUESTIONS_URL

xecho "$INFO_BULLET <biw>Validating url.</biw>"
LPI_QUESTIONS_URL_RESPONSE_CODE="$(curl -o '/dev/null'\
                                        -I -s\
                                        -w "%{http_code}\n"  "$LPI_QUESTIONS_URL"
                                  )"
if [ "$LPI_QUESTIONS_URL_RESPONSE_CODE" -eq 200 ]; then
  xecho "$INFO_BULLET <biw>Fetching LPI questions from</biw> <on_ib><biw> $LPI_QUESTIONS_URL </biw></on_ib><biw>.</biw>"
  LPI_QUESTIONS_DATA="$(curl -Ls "$LPI_QUESTIONS_URL")"
  readonly LPI_QUESTIONS_DATA
else
  fail 1 "Can't fetch LPI questions ($LPI_QUESTIONS_URL got $LPI_QUESTIONS_URL_RESPONSE_CODE response code)."
fi
xecho "\n<biw>{{ BR-scissors }} Done! {{ E-smile }}</biw>"



# Test
trap 'xecho "\n\n<on_ib><biw>CTRL+C</biw></on_ib> <biw>pressed!</biw>\n\n\n<biw>{{ BR-bear }}\n\nResults:</biw> <on_ib><biw> ($LPI_CORRECT_ANSWERS/$(( $TOTAL_QUESTIONS + 1 ))) </biw></on_ib>\n";exit 1' SIGINT
LPI_CORRECT_ANSWERS=0
xecho "\n\n<biw>LPI practice exam:\n{{ BR-bear }}</biw>\n"

TOTAL_QUESTIONS="$(( $(jq -r .[-1].id <<< "$LPI_QUESTIONS_DATA") - 1 ))"
readonly TOTAL_QUESTIONS

ASKED_QUESTIONS=()

while [ "${#ASKED_QUESTIONS[@]}" -le "$TOTAL_QUESTIONS" ]
do
  QUESTION_INDEX=$(get_random_function_id "$TOTAL_QUESTIONS")
  QUESTION_ID="$(jq -r .["$QUESTION_INDEX"].id <<< "$LPI_QUESTIONS_DATA")"
  if array_contains "$QUESTION_ID" "${ASKED_QUESTIONS[@]}"; then
    continue
  else
    ASKED_QUESTIONS+=("$QUESTION_ID")
  fi

  LPI_GOT_ALL_RIGHT=false
  LPI_QUESTION="$(jq -r .["$QUESTION_INDEX"].question <<< "$LPI_QUESTIONS_DATA")"
  LPI_ANSWERS=()
  while IFS='' read -r line; do LPI_ANSWERS+=("$line"); done < <(jq -r ".[$QUESTION_INDEX].answer[]" <<< "$LPI_QUESTIONS_DATA")

  LPI_QUESTIONS=()
  while IFS='' read -r line; do LPI_QUESTIONS+=("$line"); done < <(jq -r ".[$QUESTION_INDEX].options[]" <<< "$LPI_QUESTIONS_DATA")

  xecho "$INFO_BULLET <biw>$LPI_QUESTION</biw>\n"
  LPI_QUESTION_OPTIONS_INDEX=1

  for LPI_OPTION in "${LPI_QUESTIONS[@]}"
  do
    xecho "   $(( LPI_QUESTION_OPTIONS_INDEX ))) <biw>$LPI_OPTION</biw>"
    (( LPI_QUESTION_OPTIONS_INDEX++ ))
  done

  for LPI_USER_ANSWER_INDEX in $(seq 1 "${#LPI_ANSWERS[@]}")
  do
    user_input LPI_USER_ANSWER "int 1 ${#LPI_QUESTIONS[@]}" "\n  $INFO_BULLET <biw>Answer number $LPI_USER_ANSWER_INDEX (1 - ${#LPI_QUESTIONS[@]}):</biw> "
    (( LPI_USER_ANSWER-- ))
    if ! array_contains "${LPI_QUESTIONS[$LPI_USER_ANSWER]}" "${LPI_ANSWERS[@]}"; then
      xecho "  $FAIL_BULLET <biw>Wrong! (current answer is \"${LPI_ANSWERS[*]}\")</biw> <bir>{{ E-fail }}</bir>"
      LPI_GOT_ALL_RIGHT=false
      unset LPI_USER_ANSWER
      break
    fi
    xecho "  $SUCCESS_BULLET <biw>Nice you got that right</biw> <big>{{ E-success }}</big>"
    LPI_GOT_ALL_RIGHT=true
    unset LPI_USER_ANSWER
  done
  echo -e "\n\n"

  if $LPI_GOT_ALL_RIGHT; then
    (( LPI_CORRECT_ANSWERS++ ))
  fi

  (( QUESTION_INDEX++ ))
  unset LPI_USER_ANSWER
done

xecho "\n\n<biw>{{ BR-bear }}\n\nResults:</biw> <on_ib><biw> ($LPI_CORRECT_ANSWERS/$(( TOTAL_QUESTIONS + 1 )))</biw></on_ib>\n"