cmake_minimum_required(VERSION 3.20)

project(alx-home_ts_utils_)

file(GLOB_RECURSE SOURCES LIST_DIRECTORIES false CONFIGURE_DEPENDS
   ${CMAKE_CURRENT_SOURCE_DIR}/src/*
)

list(APPEND SOURCES
   ${CMAKE_CURRENT_SOURCE_DIR}/.env.development
   ${CMAKE_CURRENT_SOURCE_DIR}/.env.production
   ${CMAKE_CURRENT_SOURCE_DIR}/build.ts
   ${CMAKE_CURRENT_SOURCE_DIR}/build_template.ts
   ${CMAKE_CURRENT_SOURCE_DIR}/tailwind.config.ts
   ${CMAKE_CURRENT_SOURCE_DIR}/tsconfig.json
   ${CMAKE_CURRENT_SOURCE_DIR}/tsconfig.base.json
   ${CMAKE_CURRENT_SOURCE_DIR}/tsconfig.build.json

   ${CMAKE_CURRENT_SOURCE_DIR}/package.json
   ${CMAKE_CURRENT_SOURCE_DIR}/eslint.config.mjs
)

find_program(NPM npm)

add_custom_command(
   OUTPUT ${CMAKE_CURRENT_BINARY_DIR}/dist/main.js
   DEPENDS ${SOURCES}
   WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
   COMMAND NPM run "build$<$<CONFIG:DEBUG>:\:dev>"
   COMMENT "alx-home_ts_utils: Running NPM run build$<$<CONFIG:DEBUG>:\:dev>"
   VERBATIM
)

add_custom_target(alx-home_ts_utils
   DEPENDS ${CMAKE_CURRENT_BINARY_DIR}/dist/main.js
)

target_sources(alx-home_ts_utils PRIVATE
   ${CMAKE_CURRENT_BINARY_DIR}/dist/main.js
)