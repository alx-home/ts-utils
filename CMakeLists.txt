cmake_minimum_required(VERSION 3.20)

project(alx-home_ts_utils_)

file(GLOB_RECURSE ASSETS 
   ${CMAKE_CURRENT_SOURCE_DIR}/src/*
   ${CMAKE_CURRENT_SOURCE_DIR}/.env.*
   ${CMAKE_CURRENT_SOURCE_DIR}/build.ts
   ${CMAKE_CURRENT_SOURCE_DIR}/index.html
   ${CMAKE_CURRENT_SOURCE_DIR}/package.json
   ${CMAKE_CURRENT_SOURCE_DIR}/tailwind.config.ts
   ${CMAKE_CURRENT_SOURCE_DIR}/tsconfig.json
)

set(DEPS 
   ${CMAKE_CURRENT_BINARY_DIR}/dist/package.json 
   ${CMAKE_CURRENT_BINARY_DIR}/dist/ts-utils.js 
   ${CMAKE_CURRENT_BINARY_DIR}/dist/ts-utils.umd.cjs
)

add_custom_command(
   OUTPUT ${DEPS}
   DEPENDS ${ASSETS}
   WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
   COMMAND "${CMAKE_COMMAND}" -E env OUTPUT_DIR=${CMAKE_CURRENT_BINARY_DIR}/dist npm.cmd run build
)

add_custom_target(alx-home_ts_utils
   DEPENDS ${DEPS}
)

set_target_properties(alx-home_ts_utils PROPERTIES
   DEPS "${DEPS}"
)