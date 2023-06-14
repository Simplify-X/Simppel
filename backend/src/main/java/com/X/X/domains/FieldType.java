package com.X.X.domains;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum FieldType {
    @JsonProperty("Radio")
    RADIO,
    @JsonProperty("TextField")
    TEXT_FIELD,
    @JsonProperty("TextArea")
    TEXT_AREA,
    @JsonProperty("Image")
    IMAGE,
    @JsonProperty("Checkbox")
    CHECKBOX,
    @JsonProperty("Select")
    SELECT,
    @JsonProperty("AutoComplete")
    AUTO_COMPLETE,
    @JsonProperty("Tracker")
    TRACKER
}
