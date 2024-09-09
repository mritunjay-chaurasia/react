import React,{useEffect} from "react";
import Autocomplete from "@mui/joy/Autocomplete";
import Close from "@mui/icons-material/Close";
import Chip from "@mui/joy/Chip";
const MultipleSelectOption = ({
  placeholder,
  options,
  defaultValue,
  onChange,
}) => {

  return (
    <>
      <Autocomplete
        id="tags-default"
        multiple
        placeholder={placeholder}
        options={options ? options : []}
        getOptionLabel={(option) => option.label}
        defaultValue={defaultValue ? defaultValue : []}
        onChange={onChange}
        renderTags={(tags, getTagProps) =>
          tags.map((item, index) => (
            <Chip
              variant="solid"
              color="primary"
              endDecorator={<Close fontSize="sm" />}
              sx={{ minWidth: 0 }}
              {...getTagProps({ index })}
            >
              {item.label}
            </Chip>
          ))
        }
      />
    </>
  );
};
export default MultipleSelectOption;
