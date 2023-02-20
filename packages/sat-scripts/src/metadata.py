# https://substance3d.adobe.com/documentation/sat/pysbs-python-api/overview/metadata-manipulation

# create a new doc
sbs_doc = sbsgenerator.createSBSDocument(context.Context(), "foo.sbs")
# add two new string metadata to the package (doc)
sbs_doc.createMetaDataStr("foo", "bar")
sbs_doc.createMetaDataStr("fooz", "baz")
# create a new doc
sbs_doc = sbsgenerator.createSBSDocument(context.Context(), "foo.sbs")
# link a resource
res = sbs_doc.createLinkedResource(
    aResourceTypeEnum=sbsenum.ResourceTypeEnum.BITMAP, aResourcePath="resource.png"
)

# add a new url metadata
sbs_doc.createMetaDataUrl("baz", res)
