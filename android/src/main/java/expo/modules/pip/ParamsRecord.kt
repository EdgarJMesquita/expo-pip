package expo.modules.pip
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field

internal class ParamsRecord:Record {
    @Field
    var width: Int? = null

    @Field
    var height: Int? = null

    @Field
    var title: String? = null

    @Field
    var subtitle: String? = null

    @Field
    var seamlessResizeEnabled: Boolean? = null

    @Field
    var autoEnterEnabled: Boolean? = null

    @Field
    var sourceRectHint: SourceRectHintRecord? = null
}