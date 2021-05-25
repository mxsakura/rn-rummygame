import os


def update(paramsA, paramsB, paramsC):
    # code-push release RummyCenter  ./bundles/index.android.bundle 1.0.0 --deploymentName Staging --description "修改进入游戏" --mandatory false
    print(
        "code-push release RummyCenter  ./bundles/index.android.bundle %s --deploymentName %s --description %s --mandatory true" % (
            paramsA, paramsB, paramsC))
    os.system(
        "code-push release RummyCenter ./bundles/index.android.bundle %s --deploymentName %s --description %s --mandatory false" % (
            paramsA, paramsB, paramsC))


if __name__ == '__main__':
    app = "RummyCenter"
    target = input('对应的客户端版本,如:1.0.0: ')
    deploymentNameNum = input('deploymentName num,1:Production or 2:Staging: ')
    if deploymentNameNum == "1":
        deploymentName = "Production"
    else:
        deploymentName = "Staging"
    description = input("描述：")
    update(target, deploymentName, description)
