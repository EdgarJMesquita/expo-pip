package expo.modules.pip
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field

internal class SourceRectHintRecord:Record {
    @Field
    var left: Int = 0

    @Field
    var top: Int = 0

    @Field
    var right: Int = 0

    @Field
    var bottom: Int = 0
}