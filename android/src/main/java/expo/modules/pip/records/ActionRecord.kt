package expo.modules.pip.records

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

internal class ActionRecord: Record {
    @Field
    var iconName: String? = null;

    @Field
    var action: String? = null;

    @Field
    var title: String = "";

    @Field
    var description: String = "";
}