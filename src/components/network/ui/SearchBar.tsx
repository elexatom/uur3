// revidovano OK

import {Box, InputAdornment, TextField} from "@mui/material"
import React, {type ChangeEventHandler} from "react"
import SearchIcon from "@mui/icons-material/Search"

interface Props {
  search: string
  setSearch: ChangeEventHandler<HTMLInputElement>
}

export const SearchBar: React.FC<Props> = ({search, setSearch}) =>
  <Box className="p-3 border-b border-gray-200">
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      placeholder="Hledat zastávku nebo linku..."
      value={search}
      onChange={setSearch}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{fontSize: 18, color: "text.secondary"}}/>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 4,
            bgcolor: "background.default",
            fontSize: 12,
            "& fieldset": {border: "none"}
          }
        }
      }}
    />
  </Box>