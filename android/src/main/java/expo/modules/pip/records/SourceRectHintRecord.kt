package expo.modules.pip.records

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

internal class SourceRectHintRecord: Record {
    @Field
    var left: Int = 0

    @Field
    var top: Int = 0

    @Field
    var right: Int = 0

    @Field
    var bottom: Int = 0
}